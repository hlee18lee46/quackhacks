using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class AIChatManager : MonoBehaviour
{
    [Header("Backend")]
    public string baseUrl = "https://quackhacks.vercel.app";

    [Header("UI")]
    public GameObject aiChatPanel;
    public TMP_InputField messageInput;
    public TMP_Text chatText;
    public Button sendButton;
    public Button closeButton;

    void Start()
    {
        sendButton.onClick.AddListener(SendMessageToAI);
        closeButton.onClick.AddListener(CloseAIChat);
        aiChatPanel.SetActive(false);
    }

    public void OpenAIChat()
    {
        aiChatPanel.SetActive(true);
    }

    public void CloseAIChat()
    {
        aiChatPanel.SetActive(false);
    }

    public void SendMessageToAI()
    {
        string message = messageInput.text.Trim();

        if (string.IsNullOrEmpty(message))
            return;

        chatText.text += "\n\nYou: " + message;
        messageInput.text = "";

        StartCoroutine(SendAIRequest(message));
    }

    IEnumerator SendAIRequest(string message)
    {
        chatText.text += "\nPuppie: thinking...";

        AIRequest body = new AIRequest
        {
            message = message
        };

        string json = JsonUtility.ToJson(body);

        UnityWebRequest request = new UnityWebRequest(baseUrl + "/api/ai/walk-insight", "POST");
        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();
        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        chatText.text = chatText.text.Replace("\nPuppie: thinking...", "");

        if (request.result != UnityWebRequest.Result.Success)
        {
            chatText.text += "\nPuppie: Sorry, I could not connect.";
            Debug.LogError(request.error);
            yield break;
        }

        AIResponse response = JsonUtility.FromJson<AIResponse>(request.downloadHandler.text);
        chatText.text += "\nPuppie: " + response.reply;
    }
}

[System.Serializable]
public class AIRequest
{
    public string message;
}

[System.Serializable]
public class AIResponse
{
    public string reply;
}