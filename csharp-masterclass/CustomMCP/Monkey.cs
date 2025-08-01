using System.Text.Json.Serialization;

namespace CustomMCP;

public partial class Monkey
{
    public string? Name { get; set; }
    public string? Location { get; set; }
    public string? Details { get; set; }
    public string? Image { get; set; }
    public int Population { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}

[JsonSerializable(typeof(List<Monkey>))]
[JsonSerializable(typeof(Monkey))]
internal sealed partial class MonkeyContext : JsonSerializerContext { }
