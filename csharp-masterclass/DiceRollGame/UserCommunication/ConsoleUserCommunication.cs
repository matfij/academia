namespace UserCommunication;

public interface IUserCommunication
{
    int ReadInteger(string prompt);
    void ShowMessage(string message);
}

public class ConsoleUserCommunication(IConsole console) : IUserCommunication
{
    private readonly IConsole _console = console;

    public int ReadInteger(string prompt)
    {
        int result;
        do
        {
            ShowMessage(prompt);
        }
        while (!int.TryParse(_console.ReadLine(), out result));
        return result;
    }

    public void ShowMessage(string message)
    {
        _console.WriteLine(message);
    }
}
