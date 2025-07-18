"use client";

import { useState, useEffect, useCallback } from "react";
import { ChatMessage, ReportType } from "@/types";
import {
  INITIAL_GREETING,
  PROCESSING_MESSAGES,
  VALIDATION_MESSAGES,
  REPORT_TYPE_CONFIRMATIONS,
} from "@/data/mock/conversations";

const CHAT_STORAGE_KEY = "datapivots-chat-history";

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedReportType, setSelectedReportType] =
    useState<ReportType | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    "greeting" | "type-selection" | "file-upload" | "processing" | "completed"
  >("greeting");

  // Load chat history from localStorage
  useEffect(() => {
    const storedMessages = localStorage.getItem(CHAT_STORAGE_KEY);
    if (storedMessages) {
      try {
        const parsed = JSON.parse(storedMessages) as ChatMessage[];
        // Convert timestamp strings back to Date objects
        const messagesWithDates = parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(messagesWithDates);

        // Determine current step based on message history
        if (messagesWithDates.length > 1) {
          const lastMessage = messagesWithDates[messagesWithDates.length - 1];
          if (lastMessage.content.includes("Your report is ready")) {
            setCurrentStep("completed");
          } else if (lastMessage.content.includes("Structuring your report")) {
            setCurrentStep("processing");
          } else if (lastMessage.content.includes("Please upload")) {
            setCurrentStep("file-upload");
          } else {
            setCurrentStep("type-selection");
          }
        } else {
          // If only greeting message, start with type selection
          setCurrentStep("type-selection");
        }
      } catch (error) {
        console.error("Failed to parse stored chat history:", error);
        // Initialize with greeting if parsing fails
        setMessages([INITIAL_GREETING]);
        localStorage.setItem(
          CHAT_STORAGE_KEY,
          JSON.stringify([INITIAL_GREETING])
        );
      }
    } else {
      // Initialize with greeting message
      setMessages([INITIAL_GREETING]);
      setCurrentStep("type-selection");
      localStorage.setItem(
        CHAT_STORAGE_KEY,
        JSON.stringify([INITIAL_GREETING])
      );
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "timestamp">) => {
      const newMessage: ChatMessage = {
        ...message,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, newMessage]);
      return newMessage;
    },
    []
  );

  const selectReportType = useCallback(
    (reportType: ReportType) => {
      setSelectedReportType(reportType);
      setCurrentStep("file-upload");

      // Add user message
      addMessage({
        type: "user",
        content: `I want to analyze a ${reportType.replace("-", " ")} document.`,
        status: "sent",
      });

      // Add AI confirmation
      setTimeout(() => {
        addMessage({
          type: "ai",
          content: REPORT_TYPE_CONFIRMATIONS[reportType],
          status: "received",
        });
      }, 500);
    },
    [addMessage]
  );

  const uploadFile = useCallback(
    (file: File) => {
      setUploadedFile(file);
      setIsProcessing(true);
      setCurrentStep("processing");

      // Add user message
      addMessage({
        type: "user",
        content: `Uploaded file: ${file.name}`,
        status: "sent",
      });

      // Simulate file validation
      const isValidFile = validateFile(file, selectedReportType);

      if (!isValidFile) {
        setTimeout(() => {
          if (selectedReportType) {
            addMessage(VALIDATION_MESSAGES.invalidFile(selectedReportType));
          } else {
            addMessage(VALIDATION_MESSAGES.fileTypeError());
          }
          setIsProcessing(false);
          setUploadedFile(null);
          setCurrentStep("file-upload");
        }, 1000);
        return;
      }

      // Simulate processing steps
      setTimeout(() => {
        addMessage(PROCESSING_MESSAGES.fileReceived(file.name));
      }, 500);

      setTimeout(() => {
        addMessage(PROCESSING_MESSAGES.step1());
      }, 1500);

      setTimeout(() => {
        addMessage(PROCESSING_MESSAGES.step2());
      }, 2500);

      setTimeout(() => {
        addMessage(PROCESSING_MESSAGES.step3());
      }, 3500);

      setTimeout(() => {
        addMessage(PROCESSING_MESSAGES.completed());
        setIsProcessing(false);
        setCurrentStep("completed");
      }, 4500);
    },
    [selectedReportType, addMessage]
  );

  const validateFile = (file: File, reportType: ReportType | null): boolean => {
    // Check file type
    const validTypes = ["application/pdf", "image/png", "image/jpeg"];
    if (!validTypes.includes(file.type)) {
      return false;
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return false;
    }

    // Simple validation based on filename (in real app, would analyze content)
    if (reportType) {
      // For demo purposes, accept any valid file type
      // In production, would validate file content against report type
      return true;
    }

    return true;
  };

  const removeFile = useCallback(() => {
    setUploadedFile(null);
    setIsProcessing(false);
    if (currentStep === "processing" || currentStep === "completed") {
      setCurrentStep("file-upload");
    }
  }, [currentStep]);

  const resetChat = useCallback(() => {
    setMessages([INITIAL_GREETING]);
    setSelectedReportType(null);
    setUploadedFile(null);
    setIsProcessing(false);
    setCurrentStep("type-selection");
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify([INITIAL_GREETING]));
  }, []);

  const startNewAnalysis = useCallback(() => {
    setSelectedReportType(null);
    setUploadedFile(null);
    setIsProcessing(false);
    setCurrentStep("type-selection");

    addMessage({
      type: "ai",
      content:
        "Great! Let's start a new analysis. What type of document would you like to analyze?",
      status: "received",
    });
  }, [addMessage]);

  return {
    messages,
    selectedReportType,
    uploadedFile,
    isProcessing,
    currentStep,
    selectReportType,
    uploadFile,
    removeFile,
    resetChat,
    startNewAnalysis,
    addMessage,
  };
};
