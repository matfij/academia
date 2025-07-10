using System.Text;

namespace TicketsDataAggregator;

interface ITicketsWriter
{
    public void WriteAll(string path, IEnumerable<Ticket> tickets);
}

internal class TextTicketsWriter : ITicketsWriter
{
    public void WriteAll(string path, IEnumerable<Ticket> tickets)
    {
        var builder = new StringBuilder();

        foreach (var ticket in tickets)
        {
            var ticketFormatted = $"{ticket.Title,-40} | {ticket.Date} | {ticket.Time}";
            builder.AppendLine(ticketFormatted);
        }

        using var writer = new StreamWriter(path);
        writer.Write(builder.ToString());
    }
}
