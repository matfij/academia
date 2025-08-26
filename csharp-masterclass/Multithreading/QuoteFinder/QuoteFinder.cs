namespace Multithreading.QuoteFinder;

internal class QuoteFinder(
    IUserInterface userInterface,
    IQuoteRepository quoteRepository)
{
    private readonly IUserInterface _userInterface = userInterface;
    private readonly IQuoteRepository _quoteRepository = quoteRepository;

    public async void Run()
    {
        _userInterface.PrintMessage("Enter word to search for:");
        var targetWord = _userInterface.GetValue<string>(
            (string input) => input.Length > 0 ? input : throw new ArgumentNullException());

        _userInterface.PrintMessage("Enter number of pages to search:");
        var page = _userInterface.GetValue<int>(int.Parse);

        _userInterface.PrintMessage("Enter number of words per page:");
        var limit = _userInterface.GetValue<int>(int.Parse);

        List<Quote> quotes = [];
        try
        {
            for (int i = 0; i < page; i++)
            {
                var newQuotes = await _quoteRepository.Read(i, limit);
                quotes.AddRange(newQuotes);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($" Unable to read quotes: {ex.Message}");
        }

        foreach (Quote quote in quotes)
        {
            Console.WriteLine(quote);
        }
    }
}
