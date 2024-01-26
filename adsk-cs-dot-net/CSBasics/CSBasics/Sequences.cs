using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSBasics
{
    internal class Sequences
    {
        public static void DisplaySequence(IEnumerable<string> names, int count)
        {
            // foreach - design for enumerating sequences
            // is read-only - can't modify items
            foreach (string name in names.Take(count))
            {
                Console.WriteLine(name);
            }
        }

        public static void DisplaySequence(IReadOnlyList<string> names, bool addCount)
        {
            // for - for index access
            for (int i = 0; i < names.Count; i++)
            {
                if (addCount)
                {
                    Console.WriteLine($"{i}. {names[i]}");
                    continue;
                }
                Console.WriteLine(names[i]);
            }
        }

        public static IEnumerable<string> DisplayFiles(string path)
        {
            // while - for recursive collections traversing
            var dir = new DirectoryInfo(Path.GetDirectoryName(path));
            while (dir != null)
            {
                // pass value to the caller and continue execution on next request
                // letting the caller deal with iteration result
                yield return dir.Name;
                dir = dir.Parent;
            }
            // do while - will execute at least once

            // this can be done with a for loop - syntactic sugar for a while loop\
            for (var folder = new DirectoryInfo(Path.GetDirectoryName(path)); folder != null; folder = folder.Parent)
            {
                yield return folder.Name;
            }
        }


    }
}
