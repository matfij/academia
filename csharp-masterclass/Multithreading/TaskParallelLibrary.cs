namespace Multithreading;

internal static class TaskParallelLibrary
{
    // Task - unit of work that can be executed async on a separate thread
    // lightweight, fast and scalable, higher abstraction level
    // runs independently of the main thread

    // Continuation - action that will be executed after Task is completed

    // Task lifecycle
    // created - task object exists
    // waiting for activation  - if async function - starts immediately and return a task which is not yer running
    // waiting to run - task has ben scheduled
    // running - delegate is actively executing on some thread
    // waiting for children to complete - wait until al inner (child) tasks return result
    // canceled | ran to completion | failed

    // Task.Run() is hot - run immediately
    // new Task() is cold - needs Start()

    public static void Run()
    {
        Console.WriteLine("Start");

        //var plusTask = Task.Run(() => PrintSign('+', 500));
        //var minusTask = Task.Run(() => PrintSign('-', 500));
        //Task.WaitAll(plusTask, minusTask);

        var taskWithResult = Task.Run(() => CalculateLength("Hi there!"));
        taskWithResult.Wait();
        Console.WriteLine($"Task result: {taskWithResult.Result}");

        Console.WriteLine("End");
        Console.ReadKey();
    }

    public static Task<string> FormatSquaredNumbersFrom1To(int n)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(n, 0);
        return Task
            .Run(() => Enumerable.Range(1, n).Select(n => n*n))
            .ContinueWith((task) => string.Join(", ", task.Result));
    }

    public static void TaskToCancel()
    {
        var cancellationToken = new CancellationTokenSource();

        var endlessTask = new Task(() => EndlessWork(cancellationToken.Token), cancellationToken.Token);
        endlessTask.Start();

        var input = '.';
        do
        {
            Console.WriteLine("Give input");
            input = Console.ReadKey().KeyChar;
        }
        while (input != 'x');

        cancellationToken.Cancel();
    }

    public static void PrintSign(char sign, int count)
    { 
        Enumerable.Repeat(sign, count).ToList().ForEach(Console.Write);
    }

    public static int CalculateLength(string input)
    {
        Console.WriteLine($"Inside {nameof(CalculateLength)}");
        Thread.Sleep(2000);
        return input.Length;
    }

    private static void EndlessWork(CancellationToken token)
    {
        while (!token.IsCancellationRequested)
        {
            Console.WriteLine("Working...");
            Thread.Sleep(1000);
        }
    }
}
