using UnityEngine;
using TMPro;

public class WalkUIButtonController : MonoBehaviour
{
    public WalkieApiClient api;
    public TMP_Text statusText;

    public void OnStartWalk()
    {
        statusText.text = "Walk started!";
        Debug.Log("Walk Started");

        Debug.Log("START BUTTON CLICKED");

        if (statusText != null)
            statusText.text = "START BUTTON CLICKED";
        else
            Debug.LogError("StatusText is missing!");
    }

    public void OnStopWalk()
    {
        statusText.text = "Saving walk...";
        api.SaveWalk(2f, 32f, "Neighborhood Park", "happy");
    }

    public void OnDashboard()
    {
        statusText.text = "Loading insights...";
        api.GetInsights();
    }

    public void OnChat()
    {
        statusText.text = "Asking puppy...";
        api.AskPuppy("What do you remember about Bori?", 2f, "happy");
    }
}