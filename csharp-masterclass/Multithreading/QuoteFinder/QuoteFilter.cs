namespace Multithreading.QuoteFinder;

internal interface IQuoteFilter
{
    Task<IEnumerable<Quote>> FilterByAsync(IEnumerable<Quote> quotes, string target);
}

internal class QuoteFilter : IQuoteFilter
{
    private readonly char[] _splitTokens = [' ', '.', ',', ';', '!', '?', '\n', '\r', '\t'];

    public async Task<IEnumerable<Quote>> FilterByAsync(IEnumerable<Quote> quotes, string target)
    {
        await Task.Delay(1000);
        return quotes.Where(quote =>
            quote.Body
                .Split(_splitTokens, StringSplitOptions.RemoveEmptyEntries)
                .Any(word => string.Equals(word, target, StringComparison.OrdinalIgnoreCase)));
    }
}
