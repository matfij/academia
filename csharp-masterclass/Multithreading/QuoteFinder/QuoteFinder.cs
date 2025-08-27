using System.Diagnostics;

namespace Multithreading.QuoteFinder;

internal class QuoteFinder(
    IUserInterface userInterface,
    IQuoteRepository quoteRepository,
    IQuoteFilter quoteFilter)
{
    private readonly IUserInterface _userInterface = userInterface;
    private readonly IQuoteRepository _quoteRepository = quoteRepository;
    private readonly IQuoteFilter _quoteFilter = quoteFilter;

    public async void Run()
    {
        _userInterface.PrintMessage("Enter word to search for:");
        var targetWord = _userInterface.GetValue<string>(
            (string input) => input.Length > 0 ? input : throw new ArgumentNullException());

        _userInterface.PrintMessage("Enter number of pages to search:");
        var page = _userInterface.GetValue<int>(int.Parse);

        _userInterface.PrintMessage("Enter number of words per page:");
        var limit = _userInterface.GetValue<int>(int.Parse);

        var stopwatch = new Stopwatch();
        stopwatch.Start();

        List<Quote> quotes = [];
        try
        {
            quotes = (await _quoteRepository.ReadParallel(page, limit)).ToList();
            //quotes = (await _quoteRepository.ReadSequential(page, limit)).ToList();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to read quotes: {ex.Message}");
        }

        stopwatch.Stop();
        Console.WriteLine($"Downloaded {quotes.Count} quotes in {stopwatch.Elapsed.TotalMilliseconds} ms.");

        var filteredQuotes = await _quoteFilter.FilterBy(quotes, targetWord);

        Console.WriteLine($"Matching quotes count: {filteredQuotes.Count()}");

        foreach (Quote quote in filteredQuotes)
        {
            Console.WriteLine($"\"{quote.Body.Replace("\n", " ")}\"");
        }
    }
}
