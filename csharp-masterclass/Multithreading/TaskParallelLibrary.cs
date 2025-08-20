namespace Multithreading;

internal static class TaskParallelLibrary
{
    // Task - unit of work that can be executed async on a separate thread
    // lightweight, fast and scalable, higher abstraction level
    // runs independently of the main thread

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
