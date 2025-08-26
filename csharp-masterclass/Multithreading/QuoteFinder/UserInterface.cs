namespace Multithreading.QuoteFinder;

internal interface IUserInterface
{
    T GetValue<T>(Func<string, T> parse);
    void PrintMessage(string message);
}

internal class ConsoleUserInterface : IUserInterface
{
    public T GetValue<T>(Func<string, T> parse)
    {
        while (true)
        {
            try
            {
                return parse(Console.ReadLine()!);
            }
            catch
            {
                Console.WriteLine("Invalid input, try again.");
            }
        }
    }

    public void PrintMessage(string message)
    {
        Console.WriteLine(message);
    }
}
