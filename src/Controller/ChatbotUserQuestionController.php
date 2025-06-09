<?php
// src/Controller/ChatbotUserQuestionController.php
namespace Chatbot\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Chatbot\Repository\UserQuestionRepositoryInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Security\Csrf\CsrfToken;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;

class ChatbotUserQuestionController extends AbstractController
{
    public function __construct(
        private string $requiredRole,
        private string $userQuestionEntityClass,
        private EntityManagerInterface          $em,
        private UserQuestionRepositoryInterface $userQuestionRepository,
    ){}

    #[Route('/user-questions', name: 'chatbot_user_questions_index')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $questions = $this->userQuestionRepository->findAll();
        return $this->render('@Chatbot/user_questions/index.html.twig', [
            'questions' => $questions,
        ]);
    }

    #[Route('/{id}/delete', name: 'chatbot_user_question_delete')]
    public function delete(Request $request, int $id): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $entityClass = $this->userQuestionEntityClass;
        $question = $this->em->getRepository($entityClass)->find($id);
        $csrfToken = $request->request->get('token');
        if (!$this->isCsrfTokenValid('delete-item', $csrfToken)) {
            throw $this->createAccessDeniedException('Invalid CSRF token');
        }

        $this->em->remove($question);
        $this->em->flush();
        $this->addFlash('success', 'Question deleted.');
        return $this->redirectToRoute('chatbot_user_questions_index');
    }
}
