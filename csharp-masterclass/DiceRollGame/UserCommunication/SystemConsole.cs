namespace UserCommunication;

public interface IConsole
{
    string ReadLine();
    void WriteLine(string message);
}

internal class SystemConsole : IConsole
{
    public string ReadLine() => Console.ReadLine() ?? "";

    public void WriteLine(string message) => Console.WriteLine(message);
}
