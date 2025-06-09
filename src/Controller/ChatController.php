<?php

namespace Chatbot\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Chatbot\Repository\ChatbotFaqRepository;
use Chatbot\Repository\ChatbotCategoryRepository;
use Chatbot\Entity\ChatbotCategory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use App\Entity\UserQuestion;
use Chatbot\Security\ChatbotUserInterface;

class ChatController extends AbstractController
{
    public function __construct(
        private ChatbotFaqRepository $chatbotFaqRepository,
        private ChatbotCategoryRepository $chatbotCategoryRepository,
        private EntityManagerInterface $em,
        private string $requiredRole,
        private string $userQuestionEntityClass,
    ){}

    #[Route('/', name: 'chatbot')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        return $this->render('@Chatbot/index.html.twig');
    }

    #[Route('/widget', name: 'chatbot_widget')]
    public function widget(): Response
    {
        return $this->render('@Chatbot/chatbot_widget.html.twig');
    }

    #[Route('/faqs', name: 'chatbot_faqs')]
    public function getFaqs(): JsonResponse
    {
        $this->denyAccessUnlessGranted($this->requiredRole);

        $chatbotFaq = $this->chatbotFaqRepository->findAll();

        $faqList = array_map(fn($faq) => [
            'id' => $faq->getId(),
            'question' => $faq->getQuestion(),
            'answer' => $faq->getAnswer(),
        ], $chatbotFaq);

        return $this->json($faqList);
    }

    #[Route('/categories', name: 'chatbot_categories')]
    public function getCategories(): JsonResponse
    {
        $this->denyAccessUnlessGranted($this->requiredRole);

        $categories = $this->chatbotCategoryRepository->findAll();

        $categoryList = array_map(fn($category) => [
            'id' => $category->getId(),
            'name' => $category->getName(),
        ], $categories);

        return $this->json($categoryList);
    }

    #[Route('/faqs/{category}', name: 'chatbot_faqs_by_category')]
    public function getFaqsByCategory( ChatbotCategory $category ): JsonResponse {
        $this->denyAccessUnlessGranted($this->requiredRole);

        $faqsByCategory = $category->getFaqs()->toArray();

        $faqList = array_map(fn($faq) => [
            'id' => $faq->getId(),
            'question' => $faq->getQuestion(),
            'answer' => $faq->getAnswer(),
        ], $faqsByCategory);

        return $this->json($faqList);
    }

    #[Route('/submit-user-question', name: 'chatbot_submit_user_question', methods: ['POST'])]
    public function submitUserQuestion(Request $request): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            $questionText = trim($data['question'] ?? '');
            if (empty($questionText)) {
                return new JsonResponse(['error' => 'Question is required'], 400);
            }

            $user = $this->getUser();
            if (!$user instanceof ChatbotUserInterface) {
                return new JsonResponse(['error' => 'Invalid user'], 403);
            }
            $userQuestionEntityClass = $this->userQuestionEntityClass;
            $userQuestion = new $userQuestionEntityClass();
            $userQuestion->setQuestionText($questionText);
            $userQuestion->setUser($user);

            $this->em->persist($userQuestion);
            $this->em->flush();

            return new JsonResponse([
                'success' => true,
                'message' => 'Question submitted successfully'
            ]);

        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => 'Failed to submit question: ' . $e->getMessage()
            ], 500);
        }
    }
}
