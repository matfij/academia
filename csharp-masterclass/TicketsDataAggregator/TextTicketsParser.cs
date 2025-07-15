using System.Globalization;

namespace TicketsDataAggregator;

interface ITicketsParser
{
    public IEnumerable<Ticket> Parse(string input);
}

internal class TextTicketsParser : ITicketsParser
{
    private readonly string[] _separators = ["Title:", "Date:", "Time:", "Visit us:"];
    private readonly Dictionary<string, CultureInfo> _domainCultureMapping = new()
    {
        { "com", new CultureInfo("en-US") },
        { "jp", new CultureInfo("ja") },
        { "fr", new CultureInfo("fr-FR") },
    };

    public IEnumerable<Ticket> Parse(string input)
    {
        var parts = input.Split(_separators, StringSplitOptions.TrimEntries);

        var domain = parts.Last().ExtractDomain();
        var culture = _domainCultureMapping[domain];

        for (var i = 1; i < parts.Length - 3; i++)
        {
            var title = parts[i];
            var date = DateOnly.Parse(parts[i + 1], culture).ToString(CultureInfo.InvariantCulture);
            var time = TimeOnly.Parse(parts[i + 2], culture).ToString(CultureInfo.InvariantCulture);

            yield return new Ticket(title, date, time);

            i += 2;
        }
    }
}
