export type Language = 'en' | 'th'

export interface Translations {
  // Common
  'common.all': string
  'common.cancel': string
  'common.or': string
  'common.timeline': string
  'common.deliverables': string
  'common.requirements': string
  'common.compensation': string
  'common.open': string
  'common.closed': string
  'common.unknown': string

  // Auth (guest)
  'auth.signIn': string
  'auth.loginToInterest': string

  // Nav
  'nav.feed': string
  'nav.post': string
  'nav.matches': string
  'nav.messages': string
  'nav.profile': string

  // Auth - Login
  'login.welcomeBack': string
  'login.signInTo': string
  'login.email': string
  'login.emailPlaceholder': string
  'login.password': string
  'login.passwordPlaceholder': string
  'login.signIn': string
  'login.signingIn': string
  'login.continueGoogle': string
  'login.noAccount': string
  'login.signUp': string

  // Auth - Signup
  'signup.createAccount': string
  'signup.joinDescription': string
  'signup.fullName': string
  'signup.namePlaceholder': string
  'signup.password': string
  'signup.passwordPlaceholder': string
  'signup.confirmPassword': string
  'signup.confirmPlaceholder': string
  'signup.create': string
  'signup.creating': string
  'signup.continueGoogle': string
  'signup.hasAccount': string
  'signup.signIn': string

  // Feed
  'feed.noPostsYet': string
  'feed.beFirst': string
  'feed.allCollabTypes': string

  // Collab Card
  'card.timeline': string

  // Create Post
  'createPost.title': string
  'createPost.subtitle': string
  'createPost.titleLabel': string
  'createPost.titlePlaceholder': string
  'createPost.descriptionLabel': string
  'createPost.descriptionPlaceholder': string
  'createPost.collabTypeLabel': string
  'createPost.collabTypePlaceholder': string
  'createPost.nicheTags': string
  'createPost.audienceSize': string
  'createPost.audiencePlaceholder': string
  'createPost.location': string
  'createPost.locationPlaceholder': string
  'createPost.showDetails': string
  'createPost.hideDetails': string
  'createPost.timelinePlaceholder': string
  'createPost.deliverablesPH': string
  'createPost.requirementsPH': string
  'createPost.compensationPH': string
  'createPost.creating': string
  'createPost.create': string

  // Post Detail
  'postDetail.collabDetails': string
  'postDetail.lookingFor': string
  'postDetail.noLongerAccepting': string
  'postDetail.deletePost': string
  'postDetail.deleteTitle': string
  'postDetail.deleteDesc': string
  'postDetail.confirmDelete': string
  'postDetail.deleting': string

  // Interest
  'interest.imInterested': string
  'interest.expressInterest': string
  'interest.expressDescription': string
  'interest.messagePlaceholder': string
  'interest.sendInterest': string
  'interest.sending': string
  'interest.interestSent': string
  'interest.interests': string
  'interest.noInterestsYet': string
  'interest.accept': string
  'interest.decline': string
  'interest.accepted': string
  'interest.declined': string
  'interest.pending': string

  // Matches
  'matches.title': string
  'matches.active': string
  'matches.completed': string
  'matches.all': string
  'matches.noMatchesYet': string
  'matches.noMatchesHint': string
  'matches.browseCollabs': string
  'matches.noCompletedYet': string
  'matches.chat': string
  'matches.matched': string
  'matches.complete': string
  'matches.markCompleteTitle': string
  'matches.markCompleteDesc': string
  'matches.yesComplete': string
  'matches.cancelCollab': string
  'matches.cancelCollabTitle': string
  'matches.cancelCollabDesc': string
  'matches.goBack': string
  'matches.yesCancelCollab': string
  'matches.updating': string

  // Messages
  'messages.title': string
  'messages.noConversations': string
  'messages.getMatched': string
  'messages.you': string
  'messages.noMessagesYet': string
  'messages.sayHi': string
  'messages.typePlaceholder': string

  // Notifications
  'notifications.title': string
  'notifications.noNotifications': string
  'notifications.noNotificationsHint': string
  'notifications.markAllRead': string

  // Profile
  'profile.editProfile': string
  'profile.signOut': string
  'profile.signOutTitle': string
  'profile.signOutDesc': string
  'profile.signOutConfirm': string
  'profile.yourCollabPosts': string
  'profile.noPostsYet': string
  'profile.createFirstPost': string
  'profile.completeProfile': string
  'profile.completeProfileHint': string
  'profile.fullName': string
  'profile.fullNamePlaceholder': string
  'profile.username': string
  'profile.usernamePlaceholder': string
  'profile.bio': string
  'profile.bioPlaceholder': string
  'profile.yourNiches': string
  'profile.followerRange': string
  'profile.followerAny': string
  'profile.followerPlaceholder': string
  'profile.socialLinks': string
  'profile.instagram': string
  'profile.tiktok': string
  'profile.youtube': string
  'profile.twitterX': string
  'profile.facebook': string
  'profile.locationLabel': string
  'profile.locationPlaceholder': string
  'profile.saving': string
  'profile.completeProfileBtn': string
  'profile.saveChanges': string
  'profile.followers': string
  'profile.edit': string
  'profile.openCollabs': string
  'profile.noOpenCollabs': string
  'profile.reviews': string

  // Reviews
  'reviews.review': string
  'reviews.reviewed': string
  'reviews.reviewDescription': string
  'reviews.rating': string
  'reviews.reviewOptional': string
  'reviews.reviewPlaceholder': string
  'reviews.submitReview': string
  'reviews.submitting': string

  // Reputation
  'reputation.collab': string
  'reputation.collabs': string

  // Verification
  'verify.verify': string
  'verify.verified': string
  'verify.verifyTitle': string
  'verify.generateCode': string
  'verify.step1': string
  'verify.step2': string
  'verify.step3': string
  'verify.check': string
  'verify.checking': string
  'verify.copied': string
  'verify.success': string
  'verify.failed': string
  'verify.expired': string

  // Toast messages
  'toast.verificationFailed': string
  'toast.passwordsMismatch': string
  'toast.passwordTooShort': string
  'toast.accountCreated': string
  'toast.enterName': string
  'toast.usernameTaken': string
  'toast.failedSaveProfile': string
  'toast.profileSaved': string
  'toast.enterTitle': string
  'toast.enterDescription': string
  'toast.selectCollabType': string
  'toast.failedCreatePost': string
  'toast.postCreated': string
  'toast.failedDeletePost': string
  'toast.postDeleted': string
  'toast.alreadyInterested': string
  'toast.failedInterest': string
  'toast.interestSent': string
  'toast.interestAccepted': string
  'toast.interestDeclined': string
  'toast.failedAcceptDecline': string
  'toast.collabCompleted': string
  'toast.collabCancelled': string
  'toast.failedUpdateStatus': string
  'toast.selectRating': string
  'toast.failedSubmitReview': string
  'toast.reviewSubmitted': string

  // Collab types
  'collabType.video': string
  'collabType.photo': string
  'collabType.livestream': string
  'collabType.podcast': string
  'collabType.blog': string
  'collabType.event': string
  'collabType.giveaway': string
  'collabType.other': string

  // Niches
  'niche.tech': string
  'niche.beauty': string
  'niche.food': string
  'niche.travel': string
  'niche.fitness': string
  'niche.fashion': string
  'niche.gaming': string
  'niche.music': string
  'niche.education': string
  'niche.lifestyle': string
  'niche.business': string
  'niche.comedy': string
  'niche.art': string
  'niche.health': string
  'niche.photography': string

  // Contracts
  'contract.createContract': string
  'contract.title': string
  'contract.titlePlaceholder': string
  'contract.requirementsFor': string
  'contract.requirementsPlaceholder': string
  'contract.deadline': string
  'contract.notes': string
  'contract.notesPlaceholder': string
  'contract.create': string
  'contract.creating': string
  'contract.viewContract': string
  'contract.contractDetails': string
  'contract.yourRequirements': string
  'contract.partnerRequirements': string
  'contract.pending': string
  'contract.accepted': string
  'contract.declined': string
  'contract.completed': string
  'contract.cancelled': string
  'contract.accept': string
  'contract.decline': string
  'contract.acceptTitle': string
  'contract.acceptDesc': string
  'contract.declineTitle': string
  'contract.declineDesc': string
  'contract.noContract': string
  'contract.noContractHint': string
  'contract.deadlinePassed': string
  'contract.daysRemaining': string
  'contract.waitingResponse': string
  'contract.newProposal': string
  'contract.active': string

  // Submissions
  'submission.submitWork': string
  'submission.description': string
  'submission.descriptionPlaceholder': string
  'submission.proofUrl': string
  'submission.proofUrlPlaceholder': string
  'submission.submit': string
  'submission.submitting': string
  'submission.submissions': string
  'submission.noSubmissions': string
  'submission.pending': string
  'submission.approved': string
  'submission.revisionRequested': string
  'submission.approve': string
  'submission.requestRevision': string
  'submission.revisionNote': string
  'submission.revisionNotePlaceholder': string
  'submission.approveTitle': string
  'submission.approveDesc': string

  // Storyboard
  'storyboard.storyboard': string
  'storyboard.createStoryboard': string
  'storyboard.addSlot': string
  'storyboard.slotDescription': string
  'storyboard.assignedTo': string
  'storyboard.save': string
  'storyboard.saving': string
  'storyboard.noStoryboard': string
  'storyboard.noStoryboardHint': string
  'storyboard.slot': string
  'storyboard.deleteSlot': string

  // Toast - Contract & Submission
  'toast.contractCreated': string
  'toast.failedCreateContract': string
  'toast.contractAccepted': string
  'toast.contractDeclined': string
  'toast.failedUpdateContract': string
  'toast.submissionCreated': string
  'toast.failedCreateSubmission': string
  'toast.submissionApproved': string
  'toast.revisionRequested': string
  'toast.failedUpdateSubmission': string
  'toast.enterContractTitle': string
  'toast.enterRequirements': string
  'toast.enterDeadline': string
  'toast.enterSubmissionDesc': string
  'toast.storyboardSaved': string
  'toast.failedSaveStoryboard': string

  // Deliverable content types
  'deliverable.video': string
  'deliverable.photo': string
  'deliverable.reel': string
  'deliverable.story': string
  'deliverable.post': string
  'deliverable.blog': string
  'deliverable.livestream': string
  'deliverable.review': string
  'deliverable.shoutout': string
  'deliverable.other': string

  // Deliverable form
  'deliverable.whatYouNeed': string
  'deliverable.addSlot': string
  'deliverable.contentType': string
  'deliverable.quantity': string
  'deliverable.details': string
  'deliverable.detailsPlaceholder': string

  // Multi-collaborator
  'collab.maxCollaborators': string
  'collab.collabMode': string
  'collab.group': string
  'collab.separate': string
  'collab.groupDesc': string
  'collab.separateDesc': string
  'collab.slotsProgress': string
  'collab.lookingForN': string
  'collab.groupChat': string
  'collab.viewChat': string
  'collab.memberCount': string

  // Admin
  'admin.title': string
  'admin.backToApp': string
  'admin.totalUsers': string
  'admin.totalPosts': string
  'admin.openPosts': string
  'admin.closedPosts': string
  'admin.totalMatches': string
  'admin.activeMatches': string
  'admin.completedMatches': string
  'admin.totalMessages': string
  'admin.totalReviews': string
  'admin.avgRating': string
  'admin.signupsLast7Days': string
  'admin.postsLast7Days': string
  'admin.recentSignups': string
  'admin.totalPageViews': string
  'admin.uniqueVisitors': string
  'admin.viewsLast7Days': string
  'admin.topPages': string
  'admin.views': string

  // Time ago
  'time.justNow': string
  'time.minutesAgo': string
  'time.hoursAgo': string
  'time.daysAgo': string
  'time.weeksAgo': string
}
