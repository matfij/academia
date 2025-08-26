namespace Multithreading;

internal class AsyncAwait
{
    // Async/await - (un)wraps results in a Task
    // async/await don't use new threads, but it uses Thread Pool
    // which mean it can execute some tasks/continuations (below await) on a different thread

    // Thread.Sleep - blocks thread execution
    // Task.Delay - blocks only method it is used in, the caller continues execution

    public static void Run()
    {
        _ = RunHeavyJob();

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
}
