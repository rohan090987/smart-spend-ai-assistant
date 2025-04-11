
import { toast } from "sonner";

// Define types
export interface UserMessage {
  content: string;
}

export interface AIResponse {
  content: string;
}

// Static financial advice data
const financialTopics = {
  savings: [
    "Consider automating your savings with a 50/30/20 rule - 50% for necessities, 30% for wants, and 20% for savings and debt repayment.",
    "High-yield savings accounts typically offer 10-25 times the interest of standard savings accounts. Consider moving your emergency fund there.",
    "Try to save at least 15% of your pre-tax income for retirement, including any employer match contributions."
  ],
  investing: [
    "For long-term goals, consider index funds which offer broad market exposure with low fees.",
    "Dollar-cost averaging—investing a fixed amount regularly regardless of market conditions—can help reduce the impact of market volatility.",
    "Consider diversifying your investments across different asset classes (stocks, bonds, real estate) to manage risk."
  ],
  debt: [
    "Focus on paying off high-interest debt first, like credit cards, which can have rates of 15-25%.",
    "Consider consolidating multiple high-interest debts into a single lower-interest loan.",
    "Check if you qualify for income-driven repayment plans for student loans, which can cap payments at a percentage of your discretionary income."
  ],
  budget: [
    "Track all expenses for at least 30 days to identify spending patterns and opportunities to cut back.",
    "Use the envelope method for discretionary spending - allocate cash to different categories and stop spending when envelopes are empty.",
    "Review and cancel unused subscriptions - the average American spends over $200 monthly on subscription services."
  ],
  retirement: [
    "Max out tax-advantaged retirement accounts like 401(k)s and IRAs before investing in taxable accounts.",
    "The 4% rule suggests withdrawing 4% of your retirement savings in the first year, then adjusting for inflation in subsequent years.",
    "Consider a Roth conversion ladder strategy to access retirement funds before age 59½ without penalties."
  ]
};

// More detailed financial analysis simulations
const detailedAnalysis = {
  spending: "Based on your recent transaction history, your restaurant spending is 35% higher than the average for your income bracket. Reducing eating out to twice per week could save approximately $320 monthly.",
  savings: "Your current savings rate is approximately 8% of your income. Increasing this to 15% would allow you to reach your home down payment goal in 3.5 years instead of 6 years.",
  debt: "With your credit card interest rates averaging 22%, prioritizing debt repayment would save you $1,240 in interest over the next year compared to your current minimum payment strategy.",
  investments: "Your investment portfolio has a 75% allocation to large-cap US stocks. Increasing international exposure to 20-30% could potentially reduce volatility while maintaining similar returns."
};

export const advisorService = {
  // Simulate an AI response to user query
  async getAIResponse(query: string): Promise<AIResponse> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const normalizedQuery = query.toLowerCase();
      let responseContent = "";
      
      // Simulate API response based on query keywords
      if (normalizedQuery.includes("save") || normalizedQuery.includes("saving")) {
        responseContent = getRandomResponse("savings");
        
        // Add detailed analysis for more specific questions
        if (normalizedQuery.includes("how much") || normalizedQuery.includes("goal")) {
          responseContent += "\n\n" + detailedAnalysis.savings;
        }
      } 
      else if (normalizedQuery.includes("invest") || normalizedQuery.includes("stock") || normalizedQuery.includes("bond")) {
        responseContent = getRandomResponse("investing");
        
        if (normalizedQuery.includes("portfolio") || normalizedQuery.includes("diversify")) {
          responseContent += "\n\n" + detailedAnalysis.investments;
        }
      }
      else if (normalizedQuery.includes("debt") || normalizedQuery.includes("loan") || normalizedQuery.includes("credit")) {
        responseContent = getRandomResponse("debt");
        
        if (normalizedQuery.includes("pay off") || normalizedQuery.includes("interest")) {
          responseContent += "\n\n" + detailedAnalysis.debt;
        }
      }
      else if (normalizedQuery.includes("budget") || normalizedQuery.includes("spend") || normalizedQuery.includes("expense")) {
        responseContent = getRandomResponse("budget");
        
        if (normalizedQuery.includes("track") || normalizedQuery.includes("reduce")) {
          responseContent += "\n\n" + detailedAnalysis.spending;
        }
      }
      else if (normalizedQuery.includes("retire") || normalizedQuery.includes("401k") || normalizedQuery.includes("ira")) {
        responseContent = getRandomResponse("retirement");
      }
      else {
        // General advice for unrecognized queries
        responseContent = "Based on your overall financial profile, I recommend focusing on building an emergency fund of 3-6 months of expenses before making other financial decisions. This provides a safety net for unexpected costs and reduces the need to rely on high-interest debt in emergencies.";
      }
      
      return { content: responseContent };
    } catch (error) {
      console.error("Error in AI advisor service:", error);
      toast.error("There was an error processing your financial query.");
      return { content: "I'm sorry, I encountered an error analyzing your financial query. Please try again with a different question." };
    }
  }
};

// Helper function to get a random response from a category
function getRandomResponse(category: keyof typeof financialTopics): string {
  const responses = financialTopics[category];
  return responses[Math.floor(Math.random() * responses.length)];
}
