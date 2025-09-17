import { PrismaClient, SubmissionStatus } from '@prisma/client';

const prisma = new PrismaClient();

// MOCK Judge Service.
// In a real application, this would be a separate microservice that communicates
// via a message queue (e.g., RabbitMQ, SQS) and runs code in a sandboxed environment (e.g., Docker).

async function runMockExecution(code: string, language: string, input: string): Promise<{ success: boolean; output: string }> {
  // Simulate execution time
  await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
  
  // Mock logic: if code contains 'error', simulate a runtime error.
  if (code.includes('error')) {
    return { success: false, output: 'Runtime Error: Something went wrong!' };
  }

  // Mock logic: very simple check for a 'hello world' type problem.
  if (language === 'javascript' && code.includes('console.log')) {
     const simulatedOutput = `Simulated output for input: ${input}`;
     return { success: true, output: simulatedOutput };
  }

  return { success: true, output: 'Mock execution successful.' };
}

export const executeCode = async (submissionId: string) => {
  try {
    // 1. Update status to PROCESSING
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'PROCESSING' },
    });

    const submission = await prisma.submission.findUnique({ 
        where: { id: submissionId },
        include: { problem: { include: { testCases: true } } }
    });

    if (!submission || !submission.problem) {
      throw new Error('Submission or related problem not found');
    }

    let finalStatus: SubmissionStatus = 'ACCEPTED';
    let finalOutput = '';

    // 2. Run against all test cases
    for (const testCase of submission.problem.testCases) {
      const result = await runMockExecution(submission.code, submission.language, testCase.input);
      
      if (!result.success) {
        finalStatus = 'RUNTIME_ERROR';
        finalOutput = result.output;
        break; // Stop on first error
      }
      
      // Very simple result check
      if (result.output.trim() !== testCase.expectedOutput.trim()) {
        finalStatus = 'WRONG_ANSWER';
        finalOutput = `Failed on input: ${testCase.input}\nExpected: ${testCase.expectedOutput}\nGot: ${result.output}`;
        break; // Stop on first wrong answer
      }
      finalOutput += `Test Case Passed: ${testCase.input}\n`;
    }

    // 3. Update final status in the database
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: finalStatus,
        output: finalOutput
      },
    });

  } catch (error) {
    console.error(`Error processing submission ${submissionId}:`, error);
    // Update submission to an error state if something goes wrong with the judge itself
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'RUNTIME_ERROR', output: 'An internal error occurred during code execution.' },
    }).catch(err => console.error(`Failed to update submission ${submissionId} to error state`, err));
  }
};
