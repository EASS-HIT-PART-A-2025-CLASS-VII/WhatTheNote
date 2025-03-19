
import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  className
}) => {
  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 border border-border hover:border-primary/20 group",
      "hover:shadow-md hover:-translate-y-1",
      className
    )}>
      <CardContent className="p-6">
        <div className="rounded-full bg-primary/10 p-3 w-fit mb-4 transition-all duration-300 group-hover:bg-primary/20">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
