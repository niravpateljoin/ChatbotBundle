<?php
namespace Chatbot\Controller;

use Chatbot\Entity\ChatbotCategory;
use Chatbot\Form\ChatbotCategoryType;
use Chatbot\Repository\ChatbotCategoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/category')]
class ChatbotCategoryController extends AbstractController
{
    public function __construct(
        private ChatbotCategoryRepository $categoryRepository,
        private EntityManagerInterface $em,
        private string $requiredRole
    )
    {}

    #[Route('/', name: 'chatbot_category_index')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        return $this->render('@Chatbot/category/index.html.twig', [
            'categories' => $this->categoryRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'chatbot_category_new')]
    public function new(Request $request): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $category = new ChatbotCategory();
        $form = $this->createForm(ChatbotCategoryType::class, $category);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($category);
            $this->em->flush();

            return $this->redirectToRoute('chatbot_category_index');
        }
        return $this->render('@Chatbot/category/form.html.twig', [
            'form' => $form->createView(),
            'category' => $category,
        ]);
    }

    #[Route('/{id}/edit', name: 'chatbot_category_edit')]
    public function edit(Request $request, ChatbotCategory $category): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $form = $this->createForm(ChatbotCategoryType::class, $category);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();

            return $this->redirectToRoute('chatbot_category_index');
        }

        return $this->render('@Chatbot/category/form.html.twig', [
            'form' => $form->createView(),
            'category' => $category,
        ]);
    }

    #[Route('/{id}/delete', name: 'chatbot_category_delete', methods: ['POST'])]
    public function delete(Request $request, ChatbotCategory $category): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $csrfToken = $request->request->get('token');

        if ($this->isCsrfTokenValid('delete-item', $csrfToken)) {
            $this->em->remove($category);
            $this->em->flush();
        } else {
            $this->addFlash('error', 'Invalid CSRF token.');
        }

        return $this->redirectToRoute('chatbot_category_index');
    }
}