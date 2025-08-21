using Multithreading;

// CPU - fetches, decodes and executes instructions from memory,
// performs arithmetic and logic operations.

// Scheduler - determines which process/thread to run next and for how long.

// Process - execution of a program, which can consist of multiple threads.
// has own memory space and resources, running independently.

// Thread - smallest unit of processing that can be scheduled by the OS.
// A process can have multiple threads, sharing the same memory space - heap.

// Concurrency - some tasks can run simultaneously, but not necessarily at the same time.
// By time slicing, the OS switches between tasks quickly, giving the illusion of parallelism.

// Parallelism - tasks run at the same time, utilizing multiple CPU cores.

// Asynchronous - tasks run independently of the main program flow,
// without blocking the main thread.

// Benefits of multithreading and asynchronous programming:
// improved performance
// increased responsiveness

// Thread pool - mechanism for creating and managing thread to minimize overhead
// of creating and removing threads


//static void PrintSigns(char sign, int count)
//{
//    Console.WriteLine($"Thread ID for {sign}: {Environment.CurrentManagedThreadId}");
//    Enumerable.Repeat(sign, count).ToList().ForEach(Console.Write);
//}

//Console.WriteLine($"Cores count: {Environment.ProcessorCount}");

//Thread plusThread = new (() => PrintSigns('+', 250));
//Thread minusThread = new (() => PrintSigns('-', 250));

//plusThread.Start();
//minusThread.Start();

//Console.WriteLine($"Main thread ID: {Environment.CurrentManagedThreadId}");


var result = TaskParallelLibrary.FormatSquaredNumbersFrom1To(5).Result;

Console.WriteLine(result);
