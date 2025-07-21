

namespace NumericTypesSuggesterForm
{
    partial class MainForm
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            CounterLabel = new Label();
            IncreaseButton = new Button();
            HideCheckbox = new CheckBox();
            DateTextBox = new TextBox();
            SuspendLayout();
            // 
            // CounterLabel
            // 
            CounterLabel.AutoSize = true;
            CounterLabel.Font = new Font("Segoe UI", 20F, FontStyle.Bold);
            CounterLabel.Location = new Point(77, 50);
            CounterLabel.Name = "CounterLabel";
            CounterLabel.Size = new Size(46, 54);
            CounterLabel.TabIndex = 0;
            CounterLabel.Text = "0";
            // 
            // IncreaseButton
            // 
            IncreaseButton.Cursor = Cursors.Hand;
            IncreaseButton.Location = new Point(104, 223);
            IncreaseButton.Name = "IncreaseButton";
            IncreaseButton.Size = new Size(112, 34);
            IncreaseButton.TabIndex = 1;
            IncreaseButton.Text = "++";
            IncreaseButton.UseVisualStyleBackColor = true;
            IncreaseButton.Click += IncreaseButton_Click;
            // 
            // HideCheckbox
            // 
            HideCheckbox.AutoSize = true;
            HideCheckbox.Location = new Point(143, 319);
            HideCheckbox.Name = "HideCheckbox";
            HideCheckbox.Size = new Size(134, 29);
            HideCheckbox.TabIndex = 2;
            HideCheckbox.Text = "Hide button";
            HideCheckbox.UseVisualStyleBackColor = true;
            HideCheckbox.CheckedChanged += HideCheckbox_CheckedChange;
            // 
            // DateTextBox
            // 
            DateTextBox.Font = new Font("Segoe UI", 15F);
            DateTextBox.Location = new Point(254, 105);
            DateTextBox.Name = "DateTextBox";
            DateTextBox.Size = new Size(333, 47);
            DateTextBox.TabIndex = 3;
            DateTextBox.KeyPress += this.DateTextBox_KeyPress;
            // 
            // MainForm
            // 
            AutoScaleDimensions = new SizeF(10F, 25F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(800, 450);
            Controls.Add(DateTextBox);
            Controls.Add(HideCheckbox);
            Controls.Add(IncreaseButton);
            Controls.Add(CounterLabel);
            Name = "MainForm";
            Text = "Numeric Types Suggester";
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Label CounterLabel;
        private Button IncreaseButton;
        private CheckBox HideCheckbox;
        private TextBox DateTextBox;
    }
}
