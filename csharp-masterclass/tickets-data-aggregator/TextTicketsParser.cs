using System.Globalization;

namespace TicketsDataAggregator;

interface ITicketsParser
{
    public IEnumerable<Ticket> Parse(string input);
}

internal class TextTicketsParser : ITicketsParser
{
    private readonly string[] _separators = ["Title:", "Date:", "Time:", "Visit us:"];
    private readonly Dictionary<string, string> _domainCultureMapping = new Dictionary<string, string>()
    {
        { "com", "en-US" },
        { "jp", "ja" },
        { "fr", "fr-FR" },
    };

    public IEnumerable<Ticket> Parse(string input)
    {
        var tickets = new List<Ticket>();

        var parts = input.Split(_separators, StringSplitOptions.TrimEntries);

        var domain = parts.Last().Split(".").Last();
        var culture = _domainCultureMapping[domain];

        for (var i = 1; i < parts.Length - 3; i++)
        {
            var title = parts[i];
            var date = DateOnly.Parse(parts[i + 1], new CultureInfo(culture)).ToString(CultureInfo.InvariantCulture);
            var time = TimeOnly.Parse(parts[i + 2], new CultureInfo(culture)).ToString(CultureInfo.InvariantCulture);

            tickets.Add(new Ticket(title, date, time));

            i += 2;
        }

        return tickets;
    }
}
