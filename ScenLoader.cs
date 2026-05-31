using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneLoader : MonoBehaviour
{
    public void OpenWalkScreen()
    {
        SceneManager.LoadScene("SampleScene");
    }

    public void OpenTalkScreen()
    {
        SceneManager.LoadScene("TalkScreen");
    }

    public void OpenAIScreen()
    {
        SceneManager.LoadScene("AIScreen");
    }
    public void OpenGalleryScreen()
    {
        SceneManager.LoadScene("GalleryScreen");
    }
}