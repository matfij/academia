using System.Text;
using UglyToad.PdfPig;

namespace TicketsDataAggregator;

interface ITicketsReader
{
    public string ReadAll();
}

internal class PdfTicketsReader : ITicketsReader
{
    private const string _format = "*.pdf";
    private const string _path = @"C:\Users\mateu\Downloads\Tickets\Tickets";

    public string ReadAll()
    {
        if (!Directory.Exists(_path))
        {
            throw new DirectoryNotFoundException();
        }

        var fileEntries = Directory.GetFiles(_path, _format);

        var builder = new StringBuilder();

        foreach (var entry in fileEntries)
        {
            using var document = PdfDocument.Open(entry);

            foreach (var page in document.GetPages())
            {
                builder.AppendLine(page.Text);
            }
        }

        return builder.ToString();
    }
}
