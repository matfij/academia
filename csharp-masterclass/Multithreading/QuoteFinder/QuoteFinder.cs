namespace Multithreading.QuoteFinder;

internal class QuoteFinder
{
    private IUserInterface _userInterface;

    public QuoteFinder(IUserInterface userInterface)
    {
        _userInterface = userInterface;
    }

    public void Run()
    {
        _userInterface.PrintMessage("Enter word to search for:");
        var targetWord = _userInterface.GetValue<string>(
            (string input) => input.Length > 0 ? input : throw new ArgumentNullException());

        _userInterface.PrintMessage("Enter number of pages to search:");
        var pageNumber = _userInterface.GetValue<int>(int.Parse);

        _userInterface.PrintMessage("Enter number of words per page:");
        var wordsPerPage = _userInterface.GetValue<int>(int.Parse);
    }
}
