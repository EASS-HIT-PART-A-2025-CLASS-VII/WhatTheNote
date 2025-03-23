import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FeatureCard from "../components/ui/FeatureCard";
import { FileText, Brain, Search, Upload, Bot, Cpu } from "lucide-react";
import AnimatedLogo from "../components/ui/AnimatedLogo";
import { LucideIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

const MotionLink = motion(Link);
const MotionButton = motion(Button);

// Define the type for a feature
type Feature = {
  icon: string;
  title: string;
  description: string;
};

// Map icon names to components
const iconMap: Record<string, LucideIcon> = {
  FileText,
  Brain,
  Search,
  Upload,
  Bot,
  Cpu,
};

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Use the Feature type for the features state
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    // Fetch features data from FastAPI backend
    fetch("http://localhost:8000/features")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched features:", data); // Debugging
        setFeatures(data);
      })
      .catch((error) => console.error("Error fetching features:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>

        <div className="container px-6 mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-balance mx-auto max-w-4xl mb-6"
          >
            Transform Your Notes with
            <br />
            <span className="relative">
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                  AI-Powered Intelligence
                </span>
              </span>
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <MotionButton
              size="lg"
              className="min-w-[160px]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (user) {
                  navigate('/dashboard');
                } else {
                  navigate('/login');
                }
              }}
            >
              Get Started
            </MotionButton>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 max-w-2xl mx-auto">
              Powerful Features to Unlock Your Documents
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const normalizedIconKey = feature.icon.replace(/[-_]/g, ""); // Normalize key
              const IconComponent = iconMap[normalizedIconKey as keyof typeof iconMap] || Cpu; // Fallback to Cpu

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard
                    icon={IconComponent} // Ensure icon renders
                    title={feature.title}
                    description={feature.description}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
