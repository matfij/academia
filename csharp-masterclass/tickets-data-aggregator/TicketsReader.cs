using System.Text;
using UglyToad.PdfPig;

namespace TicketsDataAggregator;

interface ITicketsReader
{
    public string Read(string path);
}

internal class PdfTicketsReader : ITicketsReader
{
    public string Read(string path)
    {
        var builder = new StringBuilder();

        using var document = PdfDocument.Open(path);

        foreach (var page in document.GetPages())
        {
            builder.AppendLine(page.Text);
        }

        return builder.ToString();
    }
}
