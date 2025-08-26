namespace Multithreading;

internal class AsyncAwait
{
    // Async/await - (un)wraps results in a Task
    // async/await don't use new threads, but it uses Thread Pool
    // which mean it can execute some tasks/continuations (below await) on a different thread

    // Thread.Sleep - blocks thread execution
    // Task.Delay - blocks only method it is used in, the caller continues execution

    // awaiting task will propagate exception & crush the application (like .Wait() or .Result)
    // otherwise exception will not be propagated 

    public static void Run()
    {
        _ = RunHeavyJob();

        _ = RunHeavyCalculationWithException(); // result will be faulted, but program will not crush

        Console.WriteLine("Doing another work");
    }

    private static async Task RunHeavyJob()
    {
        string result = await RunHeavyCalculation();
        Console.WriteLine(result);
    }

    private static async Task<string> RunHeavyCalculation()
    {
        Console.WriteLine("Start heavy calculation");
        //Thread.Sleep(2000);
        await Task.Delay(2000);
        return "Heavy calculation completed";
    }

    private static async Task RunHeavyCalculationWithException()
    {
        Console.WriteLine("Start heavy calculation with exception");
        Console.WriteLine("Start heavy calculation with exception");
        await Task.Delay(2000);
        throw new Exception("Run out of water!");
    }
}
