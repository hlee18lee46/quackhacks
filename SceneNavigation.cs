using UnityEngine;
using UnityEngine.SceneManagement;

public class SceneNavigation : MonoBehaviour
{
    public void GoToSelectionScreen()
    {
        SceneManager.LoadScene("SelectionScreen");
    }
}