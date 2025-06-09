<?php

namespace Chatbot\Controller;

use Chatbot\Entity\ChatbotFaq;
use Chatbot\Form\ChatbotFaqType;
use Chatbot\Repository\ChatbotFaqRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use App\Entity\UserQuestion;
#[Route('/faq')]
class ChatbotFaqController extends AbstractController
{
    public function __construct(
        private ChatbotFaqRepository $chatbotFaqRepository,
        private EntityManagerInterface $em,
        private string $requiredRole,
        private MailerInterface $mailer
    ){}

    #[Route('/', name: 'chatbot_faq_index')]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        return $this->render('@Chatbot/faq/index.html.twig', [
            'faqs' => $this->chatbotFaqRepository->findAll(),
        ]);
    }

    #[Route('/new', name: 'chatbot_faq_new', methods: ['GET', 'POST'])]
    public function new(Request $request): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $faq = new ChatbotFaq();

        // Prefill question if provided via query parameter
        $prefillQuestion = $request->query->get('question');
        $userQuestionId = $request->query->get('userQuestionId');

        if ($prefillQuestion) {
            $faq->setQuestion($prefillQuestion);
        }

        $form = $this->createForm(ChatbotFaqType::class, $faq);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->persist($faq);
            $this->em->flush();

            // Remove user question if userQuestionId passed
            if ($userQuestionId) {
                $userQuestion = $this->em->find(UserQuestion::class, $userQuestionId);
                $user = $userQuestion->getUser();
                if ($userQuestion) {
                    $this->em->remove($userQuestion);
                    $this->em->flush();

                    // Send email to the user
                    if ($user && method_exists($user, 'getEmail')) {
                        $fromEmail = $_ENV['FROM_EMAIL'];
                        $email = (new Email())
                            ->from($fromEmail)
                            ->to($user->getEmail())
                            ->subject('We’ve added your question to our FAQ')
                            ->html(sprintf(
                                '<p>Hi %s,</p><p>We’ve added your question to our FAQ section. Thank you for your contribution!</p>',
                                htmlspecialchars($user->getFirstname() ?? 'there')
                            ));

                        $this->mailer->send($email);
                    }
                } else {
                    $this->addFlash('success', 'FAQ created successfully.');
                }
            } else {
                $this->addFlash('success', 'FAQ created successfully.');
            }

            return $this->redirectToRoute('chatbot_faq_index');
        }

        return $this->render('@Chatbot/faq/form.html.twig', [
            'form' => $form->createView(),
            'title' => 'Add New FAQ'
        ]);
    }

    #[Route('/{id}/edit', name: 'chatbot_faq_edit')]
    public function edit(ChatbotFaq $faq, Request $request): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $form = $this->createForm(ChatbotFaqType::class, $faq);

        $form->handleRequest($request);
        if ($form->isSubmitted() && $form->isValid()) {
            $this->em->flush();

            return $this->redirectToRoute('chatbot_faq_index');
        }

        return $this->render('@Chatbot/faq/form.html.twig', [
            'form' => $form->createView(),
            'title' => 'Edit FAQ'
        ]);
    }

    #[Route('/{id}/delete', name: 'chatbot_faq_delete')]
    public function delete(Request $request, ChatbotFaq $faq): Response
    {
        $this->denyAccessUnlessGranted($this->requiredRole);
        $csrfToken = $request->request->get('token');

        if ($this->isCsrfTokenValid('delete-item', $csrfToken)) {
                $this->em->remove($faq);
            $this->em->flush();
        } else {
            $this->addFlash('error', 'Invalid CSRF token.');
        }

        return $this->redirectToRoute('chatbot_faq_index');
    }
}