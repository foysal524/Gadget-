const Groq = require('groq-sdk');
const { Product, Category } = require('../models');
const { Op } = require('sequelize');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.aiChat = async (req, res) => {
  const { message } = req.body;
  
  try {
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Message is required' }
      });
    }

    // Get all products and categories for AI context
    const allProducts = await Product.findAll({
      include: [{ model: Category, as: 'category', attributes: ['name'] }],
      limit: 50
    });
    
    const categories = await Category.findAll();

    // Build comprehensive context for AI with detailed product info
    const productsData = allProducts.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category?.name || 'Unknown',
      brand: p.brand || 'Unknown',
      price: p.price,
      originalPrice: p.originalPrice,
      inStock: p.inStock,
      description: p.description?.substring(0, 100) || 'No description'
    }));

    const websiteContext = `You are a helpful shopping assistant for GadgetBazar, an electronics e-commerce website.

IMPORTANT RULES:
1. When customer mentions budget (e.g., "under 2000"), ONLY recommend products with price <= that amount
2. ONLY mention products that match the customer's request (e.g., if they ask for earphones, don't mention watches or bands)
3. If no products match their criteria, say so clearly and suggest the closest alternative
4. DO NOT mention unrelated products
5. Be concise - maximum 2-3 sentences
6. List product names EXACTLY as they appear in the database

Available Products (JSON format):
${JSON.stringify(productsData, null, 2)}

When responding:
- For greetings: Just greet back warmly, don't list products
- For product queries: ONLY mention products that match their exact request
- If nothing matches: Say "We don't have [product] under [budget]" and suggest closest match
- Never mention unrelated product categories`;

    let aiResponse;
    
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: websiteContext },
          { role: 'user', content: message }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.3,
        max_tokens: 300
      });
      
      aiResponse = completion.choices[0]?.message?.content;
    } catch (error) {
      console.error('Groq API Error:', error);
      throw error;
    }
    
    // Extract ONLY products explicitly mentioned by AI
    let relatedProducts = [];
    if (aiResponse) {
      // Find products where the full name or significant portion appears in AI response
      relatedProducts = allProducts.filter(p => {
        const response = aiResponse.toLowerCase();
        const productName = p.name.toLowerCase();
        // Check if product name or key identifiers appear
        const keyParts = productName.split(' ').filter(part => part.length > 4);
        return keyParts.length > 0 && keyParts.every(part => response.includes(part));
      });
      
      // If no exact matches, don't show any products
      if (relatedProducts.length === 0) {
        relatedProducts = [];
      }
    }
    
    if (!aiResponse) {
      aiResponse = "Hello! I'm here to help you find the perfect electronics on GadgetBazar. What are you looking for today?";
    }

    res.json({
      success: true,
      data: { 
        message: aiResponse,
        relatedProducts: relatedProducts.map(p => ({ id: p.id, name: p.name, price: p.price, images: p.images }))
      }
    });
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    res.json({
      success: true,
      data: { 
        message: "Hello! I'm here to help you find electronics on GadgetBazar. What can I help you with?",
        relatedProducts: []
      }
    });
  }
};
