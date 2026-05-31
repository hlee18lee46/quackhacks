using UnityEngine;

public class FollowCameraDog : MonoBehaviour
{
    public Transform cameraTransform;

    public float followDistance = 0.5f;
    public float moveSpeed = 2f;
    public float rotateSpeed = 5f;

    void Update()
    {
        Vector3 targetPosition =
            cameraTransform.position +
            cameraTransform.forward * followDistance;

        targetPosition.y = transform.position.y;

        transform.position = Vector3.Lerp(
            transform.position,
            targetPosition,
            Time.deltaTime * moveSpeed
        );

        Vector3 direction =
            cameraTransform.position - transform.position;

        direction.y = 0;

        if (direction != Vector3.zero)
        {
            Quaternion targetRotation =
                Quaternion.LookRotation(direction);

            transform.rotation = Quaternion.Slerp(
                transform.rotation,
                targetRotation,
                Time.deltaTime * rotateSpeed
            );
        }
    }
}