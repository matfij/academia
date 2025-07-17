using System.ComponentModel;
using System.Text.Json;
using ModelContextProtocol.Server;

namespace CustomMCP;

[McpServerToolType]
internal class MonkeyTools
{
    [McpServerTool, Description("Get a list of monkeys")]
    public static async Task<string> GetMonkeyList(MonkeyService monkeyService)
    {
        var monkeys = await monkeyService.GetAll();
        return JsonSerializer.Serialize(monkeys);
    }

    [McpServerTool, Description("Get a specific monkey by name, monkey may not be found")]
    public static async Task<string?> GetMonkeyByName(MonkeyService monkeyService, string name)
    {
        var monkey = await monkeyService.GetByName(name);
        return monkey is not null ? JsonSerializer.Serialize(monkey) : null;
    }
}
