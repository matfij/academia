using Newtonsoft.Json;

namespace Multithreading.QuoteFinder;

internal interface IQuoteRepository
{
    Task<IEnumerable<Quote>> ReadParallelAsync(int pages, int limit);
    Task<IEnumerable<Quote>> ReadSequentialAsync(int pages, int limit);
}

internal class HttpQuoteRepository : IQuoteRepository, IDisposable
{
    private const string _baseUrl = "https://jsonplaceholder.typicode.com";
    private const int _firstPage = 1;
    private readonly HttpClient _httpClient = new();

    public async Task<IEnumerable<Quote>> ReadParallelAsync(int pages, int limit)
    {
        var readTasks = Enumerable
            .Range(_firstPage, pages)
            .Select(page => ReadAsync(page, limit))
            .ToList();

        var results = await Task.WhenAll(readTasks);

        return results.SelectMany(result => result);
    }

    public async Task<IEnumerable<Quote>> ReadSequentialAsync(int pages, int limit)
    {
        var allQuotes = new List<Quote>();

        for (int page = _firstPage; page <= pages; page++)
        {
            var quotes = await ReadAsync(page, limit);
            allQuotes.AddRange(quotes);
        }

        return allQuotes;
    }

    private async Task<IEnumerable<Quote>> ReadAsync(int page, int limit)
    {
        var url = $"{_baseUrl}/posts?_page={page}&_limit={limit}";

        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadAsStringAsync();

        var quotes = JsonConvert.DeserializeObject<IEnumerable<Quote>>(data);

        return quotes ?? [];
    }

    public void Dispose()
    {
        _httpClient.Dispose();
    }
}
