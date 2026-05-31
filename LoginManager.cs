using System.Collections;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.SceneManagement;

public class LoginManager : MonoBehaviour
{
    [Header("Backend")]
    public string baseUrl = "https://quackhacks.vercel.app";

    [Header("UI")]
    public TMP_InputField emailInput;
    public TMP_InputField passwordInput;
    public TMP_Text statusText;

    public void OnLogin()
    {
        StartCoroutine(LoginCoroutine());
    }

    public void OnRegister()
    {
        StartCoroutine(RegisterCoroutine());
    }

    IEnumerator LoginCoroutine()
    {
        statusText.text = "Logging in...";

        AuthRequest body = new AuthRequest
        {
            email = emailInput.text.Trim(),
            password = passwordInput.text
        };

        string json = JsonUtility.ToJson(body);

        yield return SendAuthRequest("/api/auth/login", json);
    }

    IEnumerator RegisterCoroutine()
    {
        statusText.text = "Creating account...";

        AuthRequest body = new AuthRequest
        {
            email = emailInput.text.Trim(),
            password = passwordInput.text
        };

        string json = JsonUtility.ToJson(body);

        yield return SendAuthRequest("/api/auth/register", json);
    }

    IEnumerator SendAuthRequest(string endpoint, string json)
    {
        string url = baseUrl + endpoint;

        UnityWebRequest request = new UnityWebRequest(url, "POST");

        byte[] bodyRaw = Encoding.UTF8.GetBytes(json);

        request.uploadHandler = new UploadHandlerRaw(bodyRaw);
        request.downloadHandler = new DownloadHandlerBuffer();

        request.SetRequestHeader("Content-Type", "application/json");

        yield return request.SendWebRequest();

        string responseText = request.downloadHandler.text;

        Debug.Log("Auth response: " + responseText);

        if (request.result != UnityWebRequest.Result.Success)
        {
            statusText.text = "Network error: " + request.error;
            Debug.LogError(responseText);
            yield break;
        }

        AuthResponse response = JsonUtility.FromJson<AuthResponse>(responseText);

        if (response == null || response.success == false)
        {
            statusText.text = response != null ? response.message : "Login failed";
            yield break;
        }

        statusText.text = "Success! Loading AR...";

        PlayerPrefs.SetString("userId", response.user.id);
        PlayerPrefs.SetString("email", response.user.email);
        PlayerPrefs.SetString("petName", "Bori");
        PlayerPrefs.Save();

        SceneManager.LoadScene("SelectionScreen");
    }
}

[System.Serializable]
public class AuthRequest
{
    public string email;
    public string password;
}

[System.Serializable]
public class AuthResponse
{
    public bool success;
    public string message;
    public AuthUser user;
}

[System.Serializable]
public class AuthUser
{
    public string id;
    public string email;
}