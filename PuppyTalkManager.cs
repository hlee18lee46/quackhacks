using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

public class PuppyTalkManager : MonoBehaviour
{
    [Header("Backend")]
    public string baseUrl = "https://quackhacks.vercel.app";

    [Header("User")]
    public string userId = "user123";
    public string petName = "Bori";
    public float walkDistanceMiles = 2f;
    public string petMood = "happy";

    [Header("UI")]
    public TMP_Text chatText;
    public TMP_InputField messageInput;
    public Button sendButton;
    public Button backButton;

    private string threadId = "";

    void Start()
    {
        sendButton.onClick.AddListener(SendMessage);

        if (backButton != null)
            backButton.onClick.AddListener(GoBack);

        chatText.text = "🐶 Bori: Hi! I missed you. Want to talk?";
    }

    public void SendMessage()
    {
        string message = messageInput.text.Trim();

        if (string.IsNullOrEmpty(message))
            return;

        chatText.text += "\n\nYou: " + message;
        messageInput.text = "";

        StartCoroutine(SendTalkRequest(message));
    }

    IEnumerator SendTalkRequest(string message)
    {
        chatText.text += "\nBori: thinking...";

        PuppyChatRequest body = new PuppyChatRequest
        {
            userId = userId,
            petName = petName,
            walkDistanceMiles = walkDistanceMiles,
            petMood = petMood,
            message = message,
            threadId = threadId
        };

        string json = JsonUtility.ToJson(body);

        UnityWebRequest request =
            new UnityWebRequest(baseUrl + "/api/chat/gradient-backboard", "POST");

        byte[] rawBody = Encoding.UTF8.GetBytes(json);

        request.uploadHandler = new UploadHandlerRaw(rawBody);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        chatText.text = chatText.text.Replace("\nBori: thinking...", "");

        Debug.Log("Puppy Chat Status: " + request.responseCode);
        Debug.Log("Puppy Chat Response: " + request.downloadHandler.text);

        if (request.result != UnityWebRequest.Result.Success)
        {
            chatText.text += "\nBori: Sorry, I could not connect.";
            Debug.LogError(request.error);
            yield break;
        }

        PuppyChatResponse response =
            JsonUtility.FromJson<PuppyChatResponse>(request.downloadHandler.text);

        if (response != null && response.success)
        {
            threadId = response.threadId;

            string reply = !string.IsNullOrEmpty(response.reply)
                ? response.reply
                : response.aiResponse;

            chatText.text += "\nBori: " + reply;
        }
        else
        {
            chatText.text += "\nBori: Woof... something went wrong.";
        }
    }

    public void GoBack()
    {
        SceneManager.LoadScene("SelectionScreen");
    }
}

[System.Serializable]
public class PuppyChatRequest
{
    public string userId;
    public string message;
    public string petName;
    public float walkDistanceMiles;
    public string petMood;
    public string threadId;
}

[System.Serializable]
public class PuppyChatResponse
{
    public bool success;
    public string reply;
    public string aiResponse;
    public string threadId;
}