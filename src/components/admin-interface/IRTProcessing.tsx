'use client';

import { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Progress } from '~/components/ui/progress';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { calculateIRT } from '~/actions/calculate-irt';

interface Step {
  name: string;
  message: string;
}

interface StepState {
  timestamp: string;
  message: string;
  details: string;
  status: 'complete' | 'error' | null;
}

const steps: Step[] = [
  { name: 'Initialize', message: 'Initializing IRT process...' },
  { name: 'Get Answers', message: 'Retrieving user answers...' },
  { name: 'Calculate Weights Penalaran Umum', message: 'Calculating questions weight for Penalaran Umum...' },
  { name: 'Calculate Weights Kemampuan Kuantitatif', message: 'Calculating questions weight for Kemampuan Kuantitatif...' },
  { name: 'Calculate Weights Pemahaman Bacaan dan Menulis', message: 'Calculating questions weight for Pemahaman Bacaan dab Menulis...' },
  { name: 'Calculate Weights Pengetahuan dan Pemahaman Umum', message: 'Calculating questions weight for Pengetahuan dan Pemahaman Umum...' },
  { name: 'Calculate Weights Literasi Bahasa Indonesia', message: 'Calculating questions weight for Literasi Bahasa Indonesia...' },
  { name: 'Calculate Weights Literasi Bahasa Inggris', message: 'Calculating questions weight for Literasi Bahasa Inggris...' },
  { name: 'Calculate Weights Penalaran Matematika', message: 'Calculating questions weight for Penalaran Matematika...' },
  { name: 'Compute Score', message: 'Computing final score...' },
  { name: 'Finalize', message: 'Finalizing IRT process...' },
];

export default function DisplayIRTProcessing({ tryoutId }: { tryoutId: number }) {
  const [state, setState] = useState<{
    currentStep: number;
    steps: StepState[];
    error: string;
    isComplete: boolean;
    stepDetails: string;
  }>({
    currentStep: 0,
    steps: [],
    error: '',
    isComplete: false,
    stepDetails: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const progressPercentage = Math.round((state.currentStep / steps.length) * 100)

  useEffect(() => {
    const processStep = async () => {
      if (state.currentStep > 0 && state.currentStep <= 9) {
        try {
          const result = await calculateIRT(state.currentStep, state, tryoutId); // Ensure calculateIRT is typed properly
          setState((prevState) => ({
            ...prevState,
            ...result,
            steps: [
              ...prevState.steps,
              {
                timestamp: new Date().toLocaleTimeString(),
                message: steps[state.currentStep]!.message,
                details: result.stepDetails || '',
                status: 'complete',
              },
            ],
            currentStep: prevState.currentStep + 1,
          }));
        } catch (error) {
          console.error(error);
          setState((prevState) => ({
            ...prevState,
            error: 'An error occurred during processing',
            steps: [
              ...prevState.steps,
              {
                timestamp: new Date().toLocaleTimeString(),
                message: steps[state.currentStep]!.message,
                details: 'An error occurred during this step',
                status: 'error',
              },
            ],
          }));
          setIsProcessing(false);
        }
      } else if (state.currentStep > 9) {
        setState(prevState => ({
          ...prevState,
          steps: [...prevState.steps, {
            timestamp: new Date().toLocaleTimeString(),
            message: steps[state.currentStep]!.message,
            details: state.currentStep === steps.length - 1 ? 'Process completed successfully' : '',
            status: 'complete'
          }],
          currentStep: prevState.currentStep + 1,
          isComplete: state.currentStep === steps.length - 1
        }))
      }
      if (state.currentStep >= steps.length - 1) {
        setIsProcessing(false)
      }
    };


    if (isProcessing) {
      processStep().catch((error) => {
        console.error('Error in processStep:', error);
      });
    }
  }, [state, isProcessing, tryoutId]);

  const handleProcess = () => {
    setIsProcessing(true);
    setState({
      currentStep: 0,
      steps: [],
      error: '',
      isComplete: false,
      stepDetails: '',
    });
  };

  useEffect(() => {
    if (isProcessing && state.currentStep === 0) {
      setState((prevState) => ({
        ...prevState,
        steps: [{ message: steps[0]!.message, details: '', status: 'complete', timestamp: new Date().toLocaleTimeString() }],
        currentStep: 1,
      }));
    }
  }, [isProcessing, state.currentStep]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Penilaian IRT</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Progress value={progressPercentage} className="w-[calc(100%-3rem)]" />
          <span className="text-sm font-medium ml-2">{progressPercentage}%</span>
        </div>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {state.steps.map((step, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{step.timestamp}</span>
                {step.status === 'complete' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                {step.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                {step.status === null && <Loader2 className="h-5 w-5 animate-spin text-blue-500" />}
              </div>
              <p className="font-medium">{step.message}</p>
              {step.details && <p className="text-sm text-muted-foreground mt-1">{step.details}</p>}
            </div>
          ))}
          {isProcessing && state.currentStep < steps.length && (
            <div className="flex items-center text-blue-500">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>{steps[state.currentStep]?.message}</span>
            </div>
          )}
        </ScrollArea>
        {state.isComplete && <div className="text-center font-bold text-green-600">Process Complete!</div>}
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleProcess}
          className="w-full"
          disabled={isProcessing}
        >
          {state.isComplete ? 'Restart Process' : state.steps.length === 0 ? 'Start Process' : 'Processing...'}
        </Button>
      </CardFooter>
    </Card>
  );
}

