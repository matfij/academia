using Newtonsoft.Json;

namespace Multithreading.QuoteFinder;

internal interface IQuoteRepository
{
    Task<IEnumerable<Quote>> ReadParallel(int pages, int limit);
    Task<IEnumerable<Quote>> ReadSequential(int pages, int limit);
}

internal class HttpQuoteRepository : IQuoteRepository
{
    private const string _baseUrl = "https://jsonplaceholder.typicode.com";
    private HttpClient _httpClient;

    public HttpQuoteRepository()
    {
        _httpClient = new HttpClient();
    }

    public async Task<IEnumerable<Quote>> ReadParallel(int pages, int limit)
    {
        var readTasks = Enumerable
            .Range(1, pages)
            .Select(page => Read(page, limit))
            .ToList();

        var results = await Task.WhenAll(readTasks);

        return results.SelectMany(result => result);
    }

    public async Task<IEnumerable<Quote>> ReadSequential(int pages, int limit)
    {
        var allQuotes = new List<Quote>();

        for (int page = 1; page <= pages; page++)
        {
            var quotes = await Read(page, limit);
            allQuotes.AddRange(quotes);
        }

        return allQuotes;
    }

    private async Task<IEnumerable<Quote>> Read(int page, int limit)
    {
        var url = $"{_baseUrl}/posts?_page={page}&_limit={limit}";

        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadAsStringAsync();

        var quotes = JsonConvert.DeserializeObject<IEnumerable<Quote>>(data);

        return quotes ?? [];
    }
}
