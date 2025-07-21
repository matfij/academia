namespace NumericTypesSuggesterForm
{
    public partial class MainForm : Form
    {
        private int _count = 0;

        public MainForm()
        {
            InitializeComponent();
        }

        private void IncreaseButton_Click(object sender, EventArgs e)
        {
            _count++;
            CounterLabel.Text = _count.ToString();
        }
        
        private void HideCheckbox_CheckedChange(object sender, EventArgs e)
        {
            bool isChecked = HideCheckbox.Checked;
            IncreaseButton.Visible = !IncreaseButton.Visible;
        }

        private void DateTextBox_KeyPress(object sender, KeyPressEventArgs e)
        {
            if (!IsValid(e.KeyChar))
            {
                e.Handled = true;
            }
        }

        private bool IsValid(char keyChar)
        {
            return (char.IsDigit(keyChar) && DateTextBox.Text.Length < 4) || char.IsControl(keyChar);
        }
    }
}
