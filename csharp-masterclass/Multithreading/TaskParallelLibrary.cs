namespace Multithreading;

internal static class TaskParallelLibrary
{
    // Task - unit of work that can be executed async on a separate thread
    // lightweight, fast and scalable, higher abstraction level
    // runs independently of the main thread

    // Continuation - action that will be executed after Task is completed
    // continuation is also a task

    // Task lifecycle
    // created - task object exists
    // waiting for activation  - if async function - starts immediately and return a task which is not yer running
    // waiting to run - task has ben scheduled
    // running - delegate is actively executing on some thread
    // waiting for children to complete - wait until al inner (child) tasks return result
    // canceled | ran to completion | failed

    // Task.Run() is hot - run immediately
    // new Task() is cold - needs Start()

    // Exception thrown outside of main thread will also crush an application
    // catching exception needs to be handled on the same thread
    // tasks exception can be run if task is waited (Wait/Result) as AggregateException
    // otherwise exception will not be caught - only status set to faulted

    public static void Run()
    {
        Console.WriteLine("Start");

        //var plusTask = Task.Run(() => PrintSign('+', 500));
        //var minusTask = Task.Run(() => PrintSign('-', 500));
        //Task.WaitAll(plusTask, minusTask);

        //var taskWithResult = Task.Run(() => CalculateLength("Hi there!"));
        //taskWithResult.Wait();
        //Console.WriteLine($"Task result: {taskWithResult.Result}");

        // this approach catches exception but in a synchronous (blocking) way
        //try
        //{
        //    var taskWithException = Task.Run(CrushingWork);
        //    taskWithException.Wait();
        //}
        //catch (AggregateException ex)
        //{
        //    Console.WriteLine(ex.InnerExceptions.Count);
        //    Console.WriteLine(ex.Message);
        //}

        var taskWithException = Task
            .Run(CrushingWork)
            .ContinueWith(task =>
                Console.WriteLine($"Exception caught: {task.Exception!.Message}",
                TaskContinuationOptions.OnlyOnFaulted))
            .ContinueWith(task =>
                Console.WriteLine($"Task completed OK"), // this will run since previous continuation succeeded
                TaskContinuationOptions.NotOnFaulted);

        Console.WriteLine("End");
        Console.ReadKey();
    }

    public static Task Test(string? input)
    {
        var task = Task.Run(() => ParseToIntAndPrint(input))
         .ContinueWith(result =>
         {
             result.Exception?.Handle(exception =>
             {
                 if (exception is ArgumentNullException)
                 {
                     Console.WriteLine("The input is null.");
                     return true;
                 }
                 if (exception is FormatException)
                 {
                     Console.WriteLine("The input is not in a correct format.");
                     return true;
                 }
                 else
                 {
                     Console.WriteLine("Unexpected exception type.");
                     return false;
                 }
             });
         }, TaskContinuationOptions.OnlyOnFaulted);

        return task;
    }

    public static Task<string> FormatSquaredNumbersFrom1To(int n)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(n, 0);
        return Task
            .Run(() => Enumerable.Range(1, n).Select(n => n * n))
            .ContinueWith((task) => string.Join(", ", task.Result));
    }

    public static void TaskToCancel()
    {
        var cancellationToken = new CancellationTokenSource();

        var endlessTask = new Task(() => EndlessWork(cancellationToken.Token), cancellationToken.Token);
        endlessTask.Start();
        endlessTask.ContinueWith(task =>
        {
            Console.WriteLine($"Task {task.Id} has ben canceled.");
        }, TaskContinuationOptions.OnlyOnCanceled);

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
        while (true)
        {
            token.ThrowIfCancellationRequested(); // enables correct tasks status update
            Console.WriteLine("Working...");
            Thread.Sleep(1000);
        }
    }

    private static void CrushingWork()
    {
        throw new Exception("No soup for you!");
    }

    private static void ParseToIntAndPrint(string? input)
    {
        if (input is null)
        {
            throw new ArgumentNullException();
        }

        if (long.TryParse(input, out long result))
        {
            if (result > int.MaxValue)
            {
                throw new ArgumentOutOfRangeException("The number is too big for an int.");
            }
            Console.WriteLine("Parsing successful, the result is: " + result);
        }
        else
        {
            throw new FormatException();
        }
    }
}
