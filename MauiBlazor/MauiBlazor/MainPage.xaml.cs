﻿namespace MauiBlazor
{
    public partial class MainPage : ContentPage
    {
        public MainPage()
        {
            InitializeComponent();
        }

        private async void Button_Clicked(object sender, EventArgs e)
        {
            await DisplayAlert("Native Aler", "", "Cancel");
        }
    }
}
