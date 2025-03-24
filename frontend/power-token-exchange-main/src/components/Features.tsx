
import { ArrowRight, Bolt, LayoutDashboard, Leaf, ShoppingCart, Wallet } from "lucide-react";

export const Features = () => {
  const features = [
    {
      icon: <Wallet className="h-10 w-10 text-primary" />,
      title: "Secure Wallet Integration",
      description: "Connect your crypto wallet to securely authenticate and trade power tokens with other users."
    },
    {
      icon: <Bolt className="h-10 w-10 text-primary" />,
      title: "P2P Energy Trading",
      description: "Buy and sell energy directly with other users through our decentralized marketplace."
    },
    {
      icon: <Leaf className="h-10 w-10 text-primary" />,
      title: "Carbon Credit NFTs",
      description: "Earn unique NFTs as rewards for eco-friendly energy trading and sustainable actions."
    },
    {
      icon: <LayoutDashboard className="h-10 w-10 text-primary" />,
      title: "Comprehensive Dashboard",
      description: "Track your balance, transaction history, and NFT rewards all in one place."
    },
    {
      icon: <ShoppingCart className="h-10 w-10 text-primary" />,
      title: "NFT Marketplace",
      description: "View, list, and trade your Carbon Credit NFTs with other users on our marketplace."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 border border-primary/20 rounded-full bg-primary/5 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Key Features</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">A Revolutionary Platform for Energy Trading</h2>
          <p className="text-xl text-muted-foreground">Our platform combines blockchain technology with sustainable energy initiatives to create a seamless trading experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card"
            >
              <div className="mb-6">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <a href="#" className="inline-flex items-center text-primary hover:underline">
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
