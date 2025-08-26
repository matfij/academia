using Newtonsoft.Json;

namespace Multithreading.QuoteFinder;

internal interface IQuoteRepository
{
    Task<IEnumerable<Quote>> Read(int page, int limit);
}

internal class HttpQuoteRepository : IQuoteRepository
{
    private const string _baseUrl = "https://jsonplaceholder.typicode.com";
    private HttpClient _httpClient;

    public HttpQuoteRepository()
    {
        _httpClient = new HttpClient();
    }

    public async Task<IEnumerable<Quote>> Read(int page, int limit)
    {
        var url = $"{_baseUrl}/posts?_page={page}&_limit={limit}";

        var response = await _httpClient.GetAsync(url);

        response.EnsureSuccessStatusCode();

        var data = await response.Content.ReadAsStringAsync();

        var quotes = JsonConvert.DeserializeObject<IEnumerable<Quote>>(data);

        return quotes ?? [];
    }
}
