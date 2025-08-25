
namespace Multithreading;

internal class Synchronization
{

    // Thread safety - property of a program that ensures multiple threads can
    // safely and correctly execute it without causing unexpected behavior

    // Atomic operation - indivisible - composed of a single step

    // Race condition - output of a program depends on a timing of an event
    // when multiple threads access shared data in indeterministic nature

    // Critical section - part of code which is accessed by multiple threads at once
    // and performing write operation, but limit performance gains

    public static void Run()
    {
        var counter = new Counter();
        var tasks = new List<Task>();

        for (int i = 0; i < 1000; i++)
        {
            tasks.Add(Task.Run(counter.Increment));
        }
        for (int i = 0; i < 1000; i++)
        {
            tasks.Add(Task.Run(counter.Decrement));
        }

        Task.WaitAll([.. tasks]);

        Console.WriteLine($"Counter is: {counter.Value}");
    }

    internal class Counter
    {
        public int Value { get; private set; } = 0;
        private readonly Lock _valueLock = new();

        public void Increment()
        {
            lock (_valueLock)
            {
                Value++;
            }
        }

        public void Decrement()
        {
            lock (_valueLock)
            {
                Value--;
            }
        }
    }
}
