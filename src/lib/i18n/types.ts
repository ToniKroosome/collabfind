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
  'profile.followerPlaceholder': string
  'profile.socialLinks': string
  'profile.instagram': string
  'profile.tiktok': string
  'profile.youtube': string
  'profile.twitterX': string
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

  // Toast messages
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

  // Time ago
  'time.justNow': string
  'time.minutesAgo': string
  'time.hoursAgo': string
  'time.daysAgo': string
  'time.weeksAgo': string
}
