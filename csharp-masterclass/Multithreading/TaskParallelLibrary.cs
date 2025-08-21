namespace Multithreading;

internal static class TaskParallelLibrary
{
    // Task - unit of work that can be executed async on a separate thread
    // lightweight, fast and scalable, higher abstraction level
    // runs independently of the main thread

    // Continuation - action that will be executed after Task is completed

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
}
