using System.Net.Http.Json;

namespace CustomMCP;

internal class MonkeyService
{
    private const string _baseUrl = "https://www.montemagno.com/monkeys.json";
    private readonly HttpClient _httpClient = new();
    private List<Monkey>? _monkeys;

    public async Task<List<Monkey>> GetAll()
    {
        if (_monkeys is not null)
        {
            return _monkeys;
        }

        var response = await _httpClient.GetAsync(_baseUrl);
        if (response.IsSuccessStatusCode)
        {
            _monkeys = await response.Content.ReadFromJsonAsync<List<Monkey>>() ?? [];
        }

        return _monkeys ?? [];
    }

    public async Task<Monkey?> GetByName(string name)
    {
        var monkeys = await GetAll();
        return monkeys.FirstOrDefault(m => m.Name == name);
    }
}