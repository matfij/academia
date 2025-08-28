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

        _userInterface.PrintMessage("Enable parallel run (0 - no, 1 - yes):");
        var useParallel = _userInterface.GetValue<bool>(
            (string input) => int.Parse(input) == 1 || (int.Parse(input) == 0 ? false : throw new ArgumentOutOfRangeException()));

        var stopwatch = new Stopwatch();
        stopwatch.Start();

        List<Quote> quotes = [];
        try
        {
            quotes = useParallel
                ? (await _quoteRepository.ReadParallelAsync(page, limit)).ToList()
                : (await _quoteRepository.ReadSequentialAsync(page, limit)).ToList();
        }
        catch (Exception ex)
        {
            _userInterface.PrintMessage($"Unable to read quotes: {ex.Message}");
        }

        stopwatch.Stop();
        _userInterface.PrintMessage($"Downloaded {quotes.Count} quotes in {stopwatch.Elapsed.TotalMilliseconds} ms.");

        var filteredQuotes = await _quoteFilter.FilterByAsync(quotes, targetWord);

        _userInterface.PrintMessage($"Matching quotes count: {filteredQuotes.Count()}");

        foreach (Quote quote in filteredQuotes)
        {
            _userInterface.PrintMessage($"\"{quote.Body.Replace("\n", " ")}\"");
        }
    }
}
