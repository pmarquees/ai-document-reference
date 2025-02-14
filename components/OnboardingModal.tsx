"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Command, MessageSquare, Sparkles } from "lucide-react"

interface OnboardingStep {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

const steps: OnboardingStep[] = [
  {
    title: "Command Menu Magic",
    description: "Press Cmd/Ctrl + / anywhere to open the command menu. Add headings, paragraphs, and more with just a few keystrokes!",
    icon: <Command className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "AI-Powered Writing",
    description: "Need help? Press Cmd/Ctrl + K to summon PersonioAI. Reference other documents using @ and let AI assist you with content generation.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "from-purple-500 to-pink-500"
  },
  {
    title: "Smart Document Management",
    description: "Your documents are automatically saved as you type. Access them anytime, anywhere, and organize them your way.",
    icon: <MessageSquare className="w-8 h-8" />,
    color: "from-green-500 to-emerald-500"
  }
]

interface OnboardingModalProps {
  open: boolean
  onClose: () => void
}

export function OnboardingModal({ open, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <div className="relative overflow-hidden px-2 py-8">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
          
          <div className="relative flex flex-col min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${steps[currentStep].color} shadow-xl mb-6`}
                  >
                    {steps[currentStep].icon}
                  </motion.div>
                  
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-2xl font-bold mb-4"
                  >
                    {steps[currentStep].title}
                  </motion.h2>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-muted-foreground"
                  >
                    {steps[currentStep].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-col items-center gap-8">
              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <motion.div
                    key={index}
                    initial={false}
                    animate={{
                      scale: index === currentStep ? 1.2 : 1,
                      opacity: index === currentStep ? 1 : 0.5,
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentStep 
                        ? 'bg-primary shadow-lg' 
                        : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full"
              >
                <Button
                  onClick={handleNext}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 